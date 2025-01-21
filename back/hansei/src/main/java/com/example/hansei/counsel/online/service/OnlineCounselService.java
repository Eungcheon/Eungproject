package com.example.hansei.counsel.online.service;

import java.time.LocalDateTime;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.hansei.counsel.online.dto.OnlineCounselDto;
import com.example.hansei.counsel.online.entity.OnlineCounsel;
import com.example.hansei.counsel.online.repository.OnlineCounselRepository;

@Service
public class OnlineCounselService {
	
	@Autowired
    private OnlineCounselRepository counselRepository;
	
	@Autowired
	private ModelMapper modelMapper;

    public Page<OnlineCounselDto> getCounsels(int page, int size, String sort) {
        Sort.Direction direction = sort.equals("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "createdDate"));
        return counselRepository.findAll(pageable).map(this::convertToDto);
    }

    public OnlineCounselDto getCounsel(Long id) {
    	OnlineCounsel counsel = counselRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Counsel not found"));
        return convertToDto(counsel);
    }

    public OnlineCounselDto createCounsel(OnlineCounselDto counselDto) {
    	OnlineCounsel counsel = convertToEntity(counselDto);
        counsel.setCreatedDate(LocalDateTime.now());
        OnlineCounsel savedCounsel = counselRepository.save(counsel);
        return convertToDto(savedCounsel);
    }

    public OnlineCounselDto updateCounsel(Long id, OnlineCounselDto counselDto) {
    	OnlineCounsel counsel = counselRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Counsel not found"));
        counsel.setTitle(counselDto.getTitle());
        counsel.setContent(counselDto.getContent());
        OnlineCounsel updatedCounsel = counselRepository.save(counsel);
        return convertToDto(updatedCounsel);
    }

    public void deleteCounsel(Long id) {
        counselRepository.deleteById(id);
    }

    public OnlineCounselDto addAnswer(Long id, String answer, String answerer) {
    	OnlineCounsel counsel = counselRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Counsel not found"));
        counsel.setAnswer(answer);
        counsel.setAnswerer(answerer);
        counsel.setAnswerDate(LocalDateTime.now());
        OnlineCounsel updatedCounsel = counselRepository.save(counsel);
        return convertToDto(updatedCounsel);
    }

    private OnlineCounselDto convertToDto(OnlineCounsel counsel) {
        return modelMapper.map(counsel, OnlineCounselDto.class);
    }

    private OnlineCounsel convertToEntity(OnlineCounselDto counselDto) {
        return modelMapper.map(counselDto, OnlineCounsel.class);
    }
}
