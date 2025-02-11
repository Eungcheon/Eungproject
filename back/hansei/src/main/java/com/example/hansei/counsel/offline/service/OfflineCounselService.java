package com.example.hansei.counsel.offline.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.hansei.counsel.offline.dto.OfflineCounselDto;
import com.example.hansei.counsel.offline.entity.OfflineCounsel;
import com.example.hansei.counsel.offline.repository.OfflineCounselRepository;

@Service
public class OfflineCounselService {

    private final OfflineCounselRepository offlineCounselRepository;
    private final ModelMapper modelMapper;

    public OfflineCounselService(OfflineCounselRepository offlineCounselRepository, ModelMapper modelMapper) {
        this.offlineCounselRepository = offlineCounselRepository;
        this.modelMapper = modelMapper;
    }

    // ✅ 일정 등록
    @Transactional
    public void createSchedule(OfflineCounselDto dto) {
        OfflineCounsel counsel = modelMapper.map(dto, OfflineCounsel.class);
        counsel.setReserve_status(false); // 기본값 설정
        offlineCounselRepository.save(counsel);
    }

    // ✅ 본인의 일정 조회
    @Transactional(readOnly = true)
    public List<OfflineCounselDto> getSchedulesByCounselor(String counselor) {
        return offlineCounselRepository.findByCounselor(counselor).stream()
                .map(schedule -> modelMapper.map(schedule, OfflineCounselDto.class))
                .collect(Collectors.toList());
    }

    // ✅ 일정 수정
    @Transactional
    public void updateSchedule(Long id, OfflineCounselDto dto) {
        OfflineCounsel counsel = offlineCounselRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("일정을 찾을 수 없습니다."));

        // 본인의 일정인지 확인
        if (!counsel.getCounselor().equals(dto.getCounselor())) {
            throw new IllegalArgumentException("본인이 등록한 일정만 수정 가능합니다.");
        }

        // 데이터 수정
        counsel.setCounsel_date(dto.getCounsel_date());
        counsel.setCounsel_time(dto.getCounsel_time());
        counsel.setReserve_status(dto.isReserve_status());

        offlineCounselRepository.save(counsel);
    }

    // ✅ 일정 삭제
    @Transactional
    public void deleteSchedule(Long id, String counselor) {
        OfflineCounsel counsel = offlineCounselRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("일정을 찾을 수 없습니다."));

        // 본인의 일정인지 확인
        if (!counsel.getCounselor().equals(counselor)) {
            throw new IllegalArgumentException("본인이 등록한 일정만 삭제 가능합니다.");
        }

        offlineCounselRepository.delete(counsel);
    }
    
    @Transactional
    public void reserveSchedule(Long id, String client) {
        OfflineCounsel counsel = offlineCounselRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 일정을 찾을 수 없습니다."));
        
        if (counsel.isReserve_status()) {
            throw new IllegalStateException("이미 예약된 일정입니다.");
        }

        counsel.setClient(client); // 예약자 이름 설정
        counsel.setReserve_status(true); // 상태를 예약됨으로 변경
        offlineCounselRepository.save(counsel);
    }
}

